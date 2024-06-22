import Axios from 'axios';
import JWT from 'jsonwebtoken';
import { EnvVariable } from './envVariable';

export class AxiosService {
	public axios: ReturnType<typeof Axios.create>;
	constructor(baseURL: string, serviceName: string) {
        this.axios = this.axiosCreateInstance(baseURL,serviceName);
    }
	private axiosCreateInstance(baseURL: string, serviceName: string): ReturnType<typeof Axios.create> {
		let gatewayToken: string = '';
		if (!!serviceName && serviceName.trim().length > 0) 
            gatewayToken = JWT.sign({ id: serviceName }, `${EnvVariable.GATEWAY_JWT_TOKEN}`);
        const axiosInstance: ReturnType<typeof Axios.create> = Axios.create({
            baseURL,
            headers:{
                'Content-Type':'application/json',
                Accept:'application/json',
                gatewayToken
            },
            withCredentials:true
        });
        return axiosInstance;
	}
}


