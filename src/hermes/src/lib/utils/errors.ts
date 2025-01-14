import { DateTime } from 'luxon';
import { NexusGenAllTypes } from '../types/nexus';

/**
 * creates and app error
 */
export const createAppError = (message: string): NexusGenAllTypes['AppError'] => {
  return {
    name: 'App Error',
    message,
    createdAt: DateTime.now().toISO(),
  };
};
