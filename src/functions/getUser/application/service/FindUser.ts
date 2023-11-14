import { getUserRecord } from '../../framework/aws/dynamo-user-repository';
import { UserNotFoundError } from '../../domain/user-not-found-error';
import { tracer } from '../../framework/handler';

/**
 * Finds a journal with a specified staffNumber.
 * Throws a JournalNotFoundError if the repo could not find one.
 * Throws a JournalDecompressionError if decompression fails
 * @param staffNumber the staff number of the journal to find
 */
export async function findUser(
  staffNumber: string,
): Promise<void> {
  const userRecord = await getUserRecord(staffNumber);

  if (!userRecord) {
    throw new UserNotFoundError();
  }
}
