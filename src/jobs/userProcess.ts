import { get } from 'config';
import { Connection, getConnection } from 'typeorm';
import { UserMessage } from '../customTypesDec/interfaceDec'
import { LinkRepository } from '../repository/LinkRepository';
import { UserRepository } from '../repository/UserRepository';
import { EmailObj } from '../customTypesDec/interfaceDec';
import publishToQueue from '../queueService/publish';
import moment from 'moment';


class UserProcess {
  private routingRoute: 'db_mail_users_test_key'
  private connection: Connection
  constructor() {
    this.connection = getConnection();
  }
  run = async (user: UserMessage) => {

    console.log(`User Process Job started for user ${user.email}`);
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
        console.log('No Disable link')
      }
    }))

    const emailObj: EmailObj = {
      email: user.email,
      links: linkArr
    };

    console.log(`Publishing message to email queue for username ${getUser.username}`);
    const isSent = await publishToQueue(this.routingRoute, Buffer.from(JSON.stringify(emailObj)));
    if (!isSent) {
      console.log(`Unable to put user ${emailObj.email} in the email queue`);
    }

    console.log(`User Process Job ended for user ${user.email}`);
  }
}

export default UserProcess;