import { createContext } from 'react';

import type { ISystemConfig } from '..';

export const ConfigContext = createContext<Partial<ISystemConfig>>({});
