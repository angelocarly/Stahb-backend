const winston = require('winston');

function prodFormat() {
    const replaceError = ({ label, level, message, stack }) => ({ label, level, message, stack });
    const replacer = (key, value) => value instanceof Error ? replaceError(value) : value;
    return winston.format.combine(winston.format.label({ label: 'ssr server log' }), format.json({ replacer }));
  }
  
  function devFormat() {
    const formatMessage = info => `${info.level} ${info.message}`;
    const formatError = info => `${info.level} ${info.message}\n\n${info.stack}\n`;
    const format = info => info instanceof Error ? formatError(info) : formatMessage(info);
    return winston.format.combine(winston.format.colorize(), winston.format.printf(format))
  }
//   winston.format.combine(
//     winston.format.timestamp({
//         format: 'YYYY-MM-DD HH:mm:ss'
//     }),
//     winston.format.errors({ stack: true }),
//     winston.format.splat(),
//     winston.format.json()

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: (process.env.NODE_ENV != 'dev' ) ? prodFormat() : devFormat(),
    defaultMeta: { service: 'Stahb' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: './logs/combined.log' })
    ], 
    exceptionHandlers: [
        new winston.transports.File({ filename: './logs/exceptions.log', timestamp: true, maxsize: 1000000 })
    ],
});


// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: (process.env.NODE_ENV != 'dev' ) ? prodFormat() : devFormat(),
        handleExceptions: true
    }));
}

logger.info("Winston logger loaded")

module.exports = logger