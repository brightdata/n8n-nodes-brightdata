import type {
	ILoadOptionsFunctions,
	INodeListSearchItems,
	INodeListSearchResult,
} from 'n8n-workflow';

type ZoneSearchItem = {
	name: string;
	type: string;
};

type ZoneSearchResponse = ZoneSearchItem[];

type DataSetItem = {
	id: string;
	name: string;
};

type DataSetResponse = DataSetItem[];

export async function getActiveZones(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	await ensureZoneExists.call(this, 'n8n_unlocker');
	await ensureZoneExists.call(this, 'n8n_serp', 'serp');
	const responseData: ZoneSearchResponse = await this.helpers.requestWithAuthentication.call(
		this,
		'brightdataApi',
		{
			method: 'GET',
			url: 'https://api.brightdata.com/zone/get_active_zones',
			json: true,
		},
	);

	const results: INodeListSearchItems[] = responseData.map((item: ZoneSearchItem) => ({
		name: item.name,
		value: item.name,
		type: item.type,
	}));

	return { results };
}

type CountrySearchResponse = {
	zone_type: {
		DC_shared: {
			country_codes: string[];
		};
		DC_dedicated_ip: {
			country_codes: string[];
		};
		DC_dedicated_host: {
			country_codes: string[];
		};
		ISP_shared: {
			country_codes: string[];
		};
		ISP_dedicated_ip: {
			country_codes: string[];
		};
		ISP_dedicated_host: {
			country_codes: string[];
		};
	};
};

export async function getCountries(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const responseData: CountrySearchResponse = await this.helpers.requestWithAuthentication.call(
		this,
		'brightdataApi',
		{
			method: 'GET',
			url: 'https://api.brightdata.com/countrieslist',
			json: true,
		},
	);

	const results: INodeListSearchItems[] = responseData.zone_type.DC_shared.country_codes.map(
		(code: string) => ({
			name: code,
			value: code,
			type: 'DC_shared',
		}),
	);

	// sort by name
	results.sort((a, b) => a.name.localeCompare(b.name));

	return { results };
}

export async function getDataSets(this: ILoadOptionsFunctions): Promise<INodeListSearchResult> {
	const responseData: DataSetResponse = await this.helpers.requestWithAuthentication.call(
		this,
		'brightdataApi',
		{
			method: 'GET',
			url: 'https://api.brightdata.com/datasets/list',
			json: true,
		},
	);

	const results: INodeListSearchItems[] = responseData.map((item: DataSetItem) => ({
		name: item.name,
		value: item.id,
		type: item.id,
	}));

	results.sort((a, b) => a.name.localeCompare(b.name));

	return { results };
}

export async function ensureZoneExists(
	this: ILoadOptionsFunctions,
	zoneName: string = 'n8n_unlocker',
	zoneType: string = 'unblocker',
): Promise<void> {
	try {
		const zones: ZoneSearchResponse = await this.helpers.requestWithAuthentication.call(
			this,
			'brightdataApi',
			{
				method: 'GET',
				url: 'https://api.brightdata.com/zone/get_active_zones',
				json: true,
			},
		);

		const hasZone = zones.some((zone: ZoneSearchItem) => zone.name === zoneName);

		if (!hasZone) {
			await this.helpers.requestWithAuthentication.call(this, 'brightdataApi', {
				method: 'POST',
				url: 'https://api.brightdata.com/zone',
				json: true,
				body: {
					zone: { name: zoneName, type: zoneType },
					plan: zoneType === 'serp' ? { type: 'unblocker', serp: true } : { type: zoneType },
				},
			});
		}
	} catch (error) {
		console.warn('Failed to ensure zone exists:', error);
	}
}
