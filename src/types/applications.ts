export type Application = {
	appliedDate: Date | null;
	companyName: string;
	createdAt: Date;
	id: string;
	jobUrl: string | null;
	notes: string | null;
	roleTitle: string;
	salary: string | null;
	source:
		| "Company Website"
		| "Glassdoor"
		| "LinkedIn"
		| "Other"
		| "Referal"
		| null;
	status:
		| "Accepted"
		| "Applied"
		| "Interviewing"
		| "Offered"
		| "Rejected"
		| "Saved"
		| "Withdrawn";
	updatedAt: Date;
	userId: string;
};
