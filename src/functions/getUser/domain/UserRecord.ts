export interface UserRecord {
  role: string;
  staffNumber: string;
  testPermissionPeriods: TestPermissionRecord[];
}

interface TestPermissionRecord {
  from: string;
  testCategory: string;
  to: boolean;
}
