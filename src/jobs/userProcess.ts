import { get } from 'config';
import { Connection, getConnection } from 'typeorm';
import { UserMessage } from '../customTypesDec/interfaceDec'
import { LinkRepository } from '../repository/LinkRepository';
import { UserRepository } from '../repository/UserRepository';
import { EmailObj } from '../customTypesDec/interfaceDec';
import publishToQueue from '../queueService/publish';
import moment from 'moment';
import JobLogger from '../Logger';


class UserProcess {
  private routingRoute = 'db_mail_users_test_queue'
  private connection: Connection
  private jobLogger: JobLogger
  constructor() {
    this.connection = getConnection();
    this.jobLogger = new JobLogger('User Process');
  }
  run = async (user: UserMessage) => {
    try {
      this.jobLogger.info(`User Process Job started for user ${user.email}`);
      const userRepository = this.connection.getCustomRepository(UserRepository);
      const linksRepository = this.connection.getCustomRepository(LinkRepository);

      const getUser = await userRepository.getUserByEmail(user.email);
      const links = await linksRepository.getLinksByUser(getUser);

      const linkArr: string[] = [];
      await Promise.all(links[0].map(async link => {

        const now = moment().format("DD-MM-YYYY");
        const linkCreated = link.date;

        const momentNow = moment(now, 'DD-MM-YYYY');
        const momentLinkCreated = moment(linkCreated, 'DD-MM-YYYY')

        const diffDays = momentNow.diff(momentLinkCreated, "days");
        if (diffDays > 30) {
          link.isDisabled = true;
          await linksRepository.updateLinkStatus(link);
          linkArr.push(link.shortUrl);
        } else {
          this.jobLogger.info('No Disable link')
        }
      }))

      const emailObj: EmailObj = {
        email: user.email,
        links: linkArr
      };

      this.jobLogger.info(`Publishing message to email queue for username ${getUser.username}`);
      const isSent = await publishToQueue(this.routingRoute, Buffer.from(JSON.stringify(emailObj)));
      if (!isSent) {
        this.jobLogger.error(`Unable to put user ${emailObj.email} in the email queue`);
      }

      this.jobLogger.info(`User Process Job ended for user ${user.email}`);
    } catch (err) {
      this.jobLogger.error(`Exception : ${err}`);
    }
  }

}

export default UserProcess;