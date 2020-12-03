import "reflect-metadata"
import { MikroORM} from "@mikro-orm/core"
import { __prod__ } from "./constants"
//import { Post } from "./entities/Post"
import microConfig from "./mikro-orm.config"
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResolver } from "./resolvers/hello"
import { PostResolver } from "./resolvers/post"

const main = async () => {

    const orm = await MikroORM.init(microConfig)
    await orm.getMigrator().up()
    console.log(`hello world `)
    // const post = orm.em.create(Post, {title: 'my first post'})
    // await orm.em.persistAndFlush(post)
    // const posts = await orm.em.find(Post, {})
    // console.log(posts)
    const app = express()
    
    // app.get('/', (_, res) => {
    //     res.send("hello, world!")
    // })

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [HelloResolver, PostResolver],
            validate: false,
        }),
        context: () => ({ em: orm.em })
    })

    apolloServer.applyMiddleware({ app })
    app.listen(2021, ()=>{
        console.log('server started on localhost:2021')
    })
}

main()