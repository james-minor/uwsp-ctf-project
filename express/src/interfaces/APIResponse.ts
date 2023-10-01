export interface APIResponseError
{
	key: string;
	message: string;
}

export interface APIResponse
{
	success: boolean;
	data?: object;
	errors?: APIResponseError[];
}