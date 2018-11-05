import {CodeSet} from "../../code-set/models/CodeSet";
import {Query} from "../../query/models/Query";
// import {Report} from "../../report/models/Report";
import {LibraryItem} from 'eds-angular4/dist/library/models/LibraryItem';

export class EnterpriseLibraryItem extends LibraryItem {
	query:Query;
	codeSet:CodeSet;
//	report: Report;
}
