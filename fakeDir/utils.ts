import cheers, {hello, goodbye} from './other.ts';
import { Direction, sum } from './miscelania/index.ts';

hello();
goodbye();
cheers();
sum(Direction.Up);