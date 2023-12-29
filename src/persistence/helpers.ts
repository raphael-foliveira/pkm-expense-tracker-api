import { DataSource } from 'typeorm';

export const truncateTables = (dataSource: DataSource) => {
  const entities = dataSource.entityMetadatas;

  return Promise.all(
    entities.map(async (entity) => {
      const repository = dataSource.getRepository(entity.name);
      await repository.query(`DROP TABLE public.${entity.tableName} CASCADE`);
    }),
  );
};
