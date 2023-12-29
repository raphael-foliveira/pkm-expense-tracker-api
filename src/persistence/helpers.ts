import { dataSource } from './data-source';

const runQueryForAllEntities = async (query: string) => {
  const entities = dataSource.entityMetadatas;
  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    const results = await repository.query(
      query.replace('?', entity.tableName),
    );
  }
};

export const deleteTables = () => {
  return runQueryForAllEntities(`DROP TABLE IF EXISTS public.? CASCADE`);
};

export const truncateTables = () => {
  return runQueryForAllEntities(`DELETE FROM public.? CASCADE`);
};
