import {CodeSetValue} from '../../code-set/models/CodeSetValue';

export class ExclusionTreeNode {
	codeSetValue : CodeSetValue;
	children : ExclusionTreeNode[];
}
