import { makeSchema } from 'nexus';
import path from 'path';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { DateTimeResolver, DateTimeTypeDefinition } from 'graphql-scalars';

import * as UserSchema from './User';
import * as ProfileSchema from './Profile';
import * as ErrorSchema from './Error';
import * as ProgramSchema from './Program';

// graphql nexus schema
export const schema = makeSchema({
  // types and resolvers
  types: [UserSchema, ErrorSchema, ProgramSchema, ProfileSchema],
  mergeSchema: {
    schema: makeExecutableSchema({
      typeDefs: [DateTimeTypeDefinition],
      resolvers: [{ DateTime: DateTimeResolver }],
    }),
  },

  // output paths of schema
  outputs: {
    schema: path.join(__dirname, '../../../schema.graphql'),
    typegen: path.join(__dirname, '../../types/nexus.ts'),
  },

  // assumes all types are not null
  nonNullDefaults: {
    input: true,
    output: true,
  },
  // app context
  contextType: {
    module: require.resolve('../context'),
    export: 'AppContext',
    alias: 'ctx',
  },
  sourceTypes: {
    modules: [
      {
        module: '@prisma/client',
        alias: 'prisma',
      },
    ],
  },
});
