import { Injectable } from '@nestjs/common';
import axios, {AxiosInstance} from 'axios';

import { HttpAdapter } from "../interfaces/http-adapter.interface";

@Injectable()
export class AxiosAdapter implements HttpAdapter {
    
    private axios: AxiosInstance = axios;

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>( url );
            // console.log(data);
            return data;
        } catch (error) {
            // console.log(error);
            throw new Error('Error en la consulta HTTP - Verificar logs');
        }
        
    }

}