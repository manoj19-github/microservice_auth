export interface RequestWithUser extends Request {
	user: any;
	body: any;
}
export interface IUser {
	_id: string;
	email: string;
}
