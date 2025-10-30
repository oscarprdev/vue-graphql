const { createYoga, createPubSub } = require('graphql-yoga');
const { createServer } = require('http');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { useServer } = require('graphql-ws/lib/use/ws');
const { WebSocketServer } = require('ws');
const pubsub = createPubSub();

let todos = [
  { id: '1', text: 'Learn Vue 3', done: false },
  { id: '2', text: 'Learn GraphQL', done: false },
];

const typeDefs = `
  type Todo { id: ID!, text: String!, done: Boolean! }
  type Query { todos: [Todo!]! }
  type Mutation {
    addTodo(text: String!): Todo!
    toggleTodo(id: ID!): Todo!
    removeTodo(id: ID!): ID!
  }
  type Subscription {
    todoAdded: Todo!
    todoUpdated: Todo!
    todoRemoved: ID!
  }
`;

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    addTodo: (_, { text }) => {
      const todo = { id: String(Date.now()), text, done: false };
      todos = [...todos, todo];
      pubsub.publish('TODO_ADDED', { todoAdded: todo });
      return todo;
    },
    toggleTodo: (_, { id }) => {
      todos = todos.map(t => (t.id === id ? { ...t, done: !t.done } : t));
      const todo = todos.find(t => t.id === id);
      pubsub.publish('TODO_UPDATED', { todoUpdated: todo });
      return todo;
    },
    removeTodo: (_, { id }) => {
      todos = todos.filter(t => t.id !== id);
      pubsub.publish('TODO_REMOVED', { todoRemoved: id });
      return id;
    },
  },
  Subscription: {
    todoAdded: {
      subscribe: () => pubsub.subscribe('TODO_ADDED'),
    },
    todoUpdated: {
      subscribe: () => pubsub.subscribe('TODO_UPDATED'),
    },
    todoRemoved: {
      subscribe: () => pubsub.subscribe('TODO_REMOVED'),
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: {
    origin: '*',
    credentials: true
  }
});

const server = createServer(yoga);
const port = 4000;

// Create WebSocket server for subscriptions
const wsServer = new WebSocketServer({
  server,
  path: '/graphql',
});

// Setup WebSocket server with graphql-ws
useServer({ schema }, wsServer);

server.listen(port, () => {
  console.log(`GraphQL server running at http://localhost:${port}/graphql`);
  console.log(`WebSocket server running at ws://localhost:${port}/graphql`);
});
