import getUserRecord from '../../framework/aws/DynamoUserRepository';
import { UserRecord } from '../../domain/UserRecord';
import UserNotFoundError from '../../domain/user-not-found-error';

/**
 * Finds a journal with a specified staffNumber.
 * Throws a JournalNotFoundError if it the repo could not find one.
 * Throws a JournalDecompressionError if decompression fails
 * @param staffNumber the staff number of the journal to find
 */
async function findUser(
  staffNumber: string,
): Promise<UserRecord> {
  const userRecord = await getUserRecord(staffNumber);
  if (!userRecord) {
    throw new UserNotFoundError();
  }

  return userRecord;
}

export default findUser;
