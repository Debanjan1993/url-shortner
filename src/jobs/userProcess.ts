import { get } from 'config';
import { Connection, getConnection } from 'typeorm';
import { UserMessage } from '../customTypesDec/interfaceDec'
import { LinkRepository } from '../repository/LinkRepository';
import { UserRepository } from '../repository/UserRepository';
import moment from 'moment';

class UserProcess {
  connection: Connection
  constructor() {
    this.connection = getConnection();
  }
  run = async (user: UserMessage) => {

    console.log(`User Process Job started for user ${user.email}`);
    const userRepository = this.connection.getCustomRepository(UserRepository);
    const linksRepository = this.connection.getCustomRepository(LinkRepository);

    const getUser = await userRepository.getUserByEmail(user.email);
    const links = await linksRepository.getLinksByUser(getUser);

    await Promise.all(links[0].map(async link => {

      const now = moment().format("DD-MM-YYYY");
      const linkCreated = link.date;

      const momentNow = moment(now, 'DD-MM-YYYY');
      const momentLinkCreated = moment(linkCreated, 'DD-MM-YYYY')

      const diffDays = momentNow.diff(momentLinkCreated, "days");
      console.log(diffDays);
      if (diffDays > 30) {
        console.log('Disable link')
        link.isDisabled = true;
        await linksRepository.updateLinkStatus(link);
      } else {
        console.log('No Disable link')
      }
    }))

    console.log(`User Process Job ended for user ${user.email}`);
  }
}

export default UserProcess;