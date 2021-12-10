import express from 'express';
import { managementInterface } from '@skatteetaten/aurora-management-interface';

const server = express();

export const managementInterfaceServer = server.use(
  managementInterface({
    endpoint: '/actuator',
    cacheDuration: 5 * 1000,
  })
);
