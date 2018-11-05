import {StartingRules} from "./StartingRules";
import {Rule} from '../../enterprise-library/models/Rule';
export class Query {
    parentQueryUuid  : string;
    startingRules : StartingRules;
    rule : Rule[];
}
