import { ErisTube } from '.';

export interface ETEvents {
	ready: [p: ErisTube];
	error: [e: Error];
}
