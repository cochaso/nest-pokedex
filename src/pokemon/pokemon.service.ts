import { Injectable } from '@nestjs/common';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose/dist';

import { Pokemon } from './entities/pokemon.entity';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name )
    private readonly PokemonModel: Model<Pokemon>
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.PokemonModel.create( createPokemonDto );
      return pokemon;

    } catch (error) {
      this.handleExpections( error );
    }

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    // Nro de pokemon
    if(!isNaN(+term)){
      pokemon = await this.PokemonModel.findOne({ no: term });
    }

    // Mongo
    if( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.PokemonModel.findById( term );
    }

    // Name
    if(!pokemon) {
      pokemon = await this.PokemonModel.findOne( { name: term.toLocaleLowerCase().trim() } );
    }

    if( !pokemon ) 
      throw new NotFoundException(`Pokemon con id, nombre o nro "${term}" no encontrado.`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemon = await this.findOne( term );

    if(updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase().trim();

    try {
      await pokemon.update( updatePokemonDto, { new: true } )
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExpections( error );
    }
   
  }

  async remove(id: string) {
    // const pokemon = await this.findOne(id);
    // await pokemon.deleteOne();
    // return { id };
    // const res = await this.PokemonModel.findByIdAndDelete( id );

    const {deletedCount} = await this.PokemonModel.deleteOne({ _id: id });
    if(deletedCount===0)
      throw new BadRequestException(`No exists un Pokemon con id : "${id}"`);

    return;
  }

  private handleExpections( error: any ){
    if(error.code===11000) {
      throw new BadRequestException(`Pokemon ya existe en la BD con alguno de los datos especificados ${ JSON.stringify(error.keyValue) }`);
    }
    console.log(error);
    throw new InternalServerErrorException(`No se puede crear el Pokemon - Verificar logs del servidor`);      
  }

}