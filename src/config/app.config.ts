export const appConfig = () => {
    return {
        environment: process.env.NODE_ENV || 'development',
        database: {
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT as string) || 5432,
            name: process.env.DB_NAME || 'mydatabase',
            username: process.env.DB_USERNAME || 'postgres',
            password: process.env.DB_PASSWORD || 'password',
            syncronize: process.env.DB_SYNC === 'true' ? true : false,
            autoLoadEntities: process.env.AUTO_LOAD === 'true' ? true : false,
        }
    }
}