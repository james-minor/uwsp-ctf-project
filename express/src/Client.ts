import { PrismaClient } from '@prisma/client';

/**
 * Globally accessible PrismaClient, enabling us to have a cached, already instantiated client object.
 * For more insight into why our PrismaClient is defined like this, see the Prisma docs:
 * https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prismaclient-in-long-running-applications
 */
const prisma: PrismaClient = new PrismaClient();

export default prisma;