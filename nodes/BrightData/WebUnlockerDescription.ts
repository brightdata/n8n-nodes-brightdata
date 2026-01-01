import { INodeProperties } from 'n8n-workflow';


export const webUnlockerOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
			},
		},
		options: [
			{
				name: 'Web Search',
				value: 'WebSearch',
				action: 'Search the web and get serp results',
				routing: {
					request: {
						method: 'POST',
						url: '/request',
						body: {
							zone: '={{$parameter["zone"]}}',
							country: '={{$parameter["country"]}}',
							url: '={{`https://www.google.com/search?q=${encodeURIComponent($parameter["query"])}&start=${(($parameter["page"] || 1) - 1) * 10}&brd_json=1`}}',
							format: 'raw',
						},
					},
				},
			},
			{
				name: 'Send a Request',
				value: 'request',
				action: 'Access and extract data from a specific URL',
				routing: {
					request: {
						method: 'POST',
						url: '/request',
						body: {
							zone: '={{$parameter["zone"]}}',
							country: '={{$parameter["country"]}}',
							method: '={{$parameter["method"]}}',
							url: '={{$parameter["url"]}}',
							format: '={{$parameter["format"]}}',
						},
					},
				},
			},
		],
		default: 'request',
	},
];

const webUnlockerParameters: INodeProperties[] = [
	// Zone - shared by both operations
	{
		displayName: 'Zone',
		name: 'zone',
		type: 'resourceLocator',
		default: {
			mode: 'list',
			value: 'n8n_unlocker',
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a Zone ...',
				typeOptions: {
					searchListMethod: 'getActiveZones',
				},
			},
		],
		required: true,
		description: 'Select the zone',
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
				operation: ['request', 'googleSearch'],
			},
		},
	},
	// Country - shared by both operations
	{
		displayName: 'Country',
		name: 'country',
		type: 'resourceLocator',
		default: {
			mode: 'list',
			value: 'us',
		},
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a Country ...',
				typeOptions: {
					searchListMethod: 'getCountries',
				},
			},
		],
		required: true,
		description: 'Select the country',
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
				operation: ['request', 'googleSearch'],
			},
		},
	},

	{
		displayName: 'Search Query',
		name: 'query',
		type: 'string',
		default: '',
		required: true,
		description: 'The search query to send to Google',
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
				operation: ['googleSearch'],
			},
		},
	},
	{
		displayName: 'Page',
		name: 'page',
		type: 'number',
		default: 1,
		description: 'The page number of search results (1 = first page, 2 = second page, etc.)',
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
				operation: ['googleSearch'],
			},
		},
	},

	{
		displayName: 'Method',
		name: 'method',
		type: 'options',
		options: [
			{
				name: 'DELETE',
				value: 'DELETE',
			},
			{
				name: 'GET',
				value: 'GET',
			},
			{
				name: 'HEAD',
				value: 'HEAD',
			},
			{
				name: 'PATCH',
				value: 'PATCH',
			},
			{
				name: 'POST',
				value: 'POST',
			},
			{
				name: 'PUT',
				value: 'PUT',
			},
		],
		default: 'GET',
		required: true,
		description: 'The HTTP method to use',
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
				operation: ['request'],
			},
		},
	},
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		default: '',
		required: true,
		description: 'The URL to send the request to',
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
				operation: ['request'],
			},
		},
	},
	{
		displayName: 'Format',
		name: 'format',
		type: 'options',
		options: [
			{
				name: 'Raw',
				value: 'raw',
			},
			{
				name: 'JSON',
				value: 'json',
			},
		],
		default: 'raw',
		required: true,
		description: 'The format of the response',
		displayOptions: {
			show: {
				resource: ['webUnlocker'],
				operation: ['request'],
			},
		},
	},
];

export const webUnlockerFields: INodeProperties[] = [...webUnlockerParameters];
