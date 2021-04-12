import logger from 'pino';

class JobLogger {

    constructor(public jobName: string) { }

    info = (message: string) => {
        logger().info(`${this.jobName} : ${message}`);
    }

    warn = (message: string, exception?: Error) => {
        exception ? logger().warn(`${this.jobName} : ${message}`, exception.stack) : logger().warn(message);
    }

    error = (message: string, exception?: Error) => {
        exception ? logger().error(`${this.jobName} : ${message}`, exception.stack) : logger().error(message);
    }

    debug = (message: string) => {
        logger().debug(`${this.jobName} : ${message}`);
    }

}

export default JobLogger;
