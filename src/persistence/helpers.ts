import { dataSource } from './data-source';

export const deleteTables = () => {
  const entities = dataSource.entityMetadatas;

  return Promise.all(
    entities.map((entity) => {
      const repository = dataSource.getRepository(entity.name);
      return repository.query(
        `DROP TABLE IF EXISTS public.${entity.tableName} CASCADE`,
      );
    }),
  );
};

export const truncateTables = () => {
  const entities = dataSource.entityMetadatas;
  return Promise.all(
    entities.map((entity) => {
      const repository = dataSource.getRepository(entity.name);
      return repository.query(`DELETE FROM public.${entity.tableName} CASCADE`);
    }),
  );
};
