import { randomUUID } from 'node:crypto';
import { store } from './store';
import type { CreateScenarioDTO, ScenarioDTO } from '../types/dto';

export const scenarioService = {
  list(): ScenarioDTO[] {
    return Array.from(store.scenarios.values()).sort((a, b) =>
      a.createdAt.localeCompare(b.createdAt),
    );
  },

  get(id: string): ScenarioDTO | undefined {
    return store.scenarios.get(id);
  },

  create(input: CreateScenarioDTO): ScenarioDTO {
    const scenario: ScenarioDTO = {
      id: randomUUID(),
      ...input,
      createdAt: new Date().toISOString(),
    };
    store.scenarios.set(scenario.id, scenario);
    return scenario;
  },

  delete(id: string): boolean {
    return store.scenarios.delete(id);
  },
};
