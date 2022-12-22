import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import axios, {AxiosInstance} from 'axios';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  // private readonly axios: AxiosInstance = axios;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly PokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) {}

  async executeSeed(){    
    
    await this.PokemonModel.deleteMany({});

    // const {data} = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=50');

    // console.log(data);
    const pokemonToInst: {name:string, no:number}[] = [];
    // const insPromArray = [];

    data.results.forEach( async ({name, url}) => {
      const segments = url.split('/');
      const no = +segments[ segments.length -2 ];

      pokemonToInst.push({name,no});
      // const pokemon = await this.PokemonModel.create( {name,no} );
      // insPromArray.push(
      //   this.PokemonModel.create( {name,no} )
      // );

    } );

    await this.PokemonModel.insertMany(pokemonToInst);
    // await Promise.all( insPromArray );

    return 'Seed ejecutado';
  }
  
}
