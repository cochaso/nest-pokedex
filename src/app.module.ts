import { join } from 'path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { JoiValidationSchema } from './config/joi.validation';
import { EnvConfiguration } from './config/app.config';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ EnvConfiguration ],
      validationSchema: JoiValidationSchema
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'),
      }),

    MongooseModule.forRoot( process.env.MONGODB ),    
    PokemonModule,
    CommonModule,
    SeedModule
  ],
})
export class AppModule {
  constructor (){
    // console.log( process.env );
  }
}
