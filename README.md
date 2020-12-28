
npm-install-all into terminal should install all dependencies, if not install node, cors, react, typescript, express and mongoose
This project will be using typescript which is just typed js, extension is .tsx (typescript/dart/some typed version js over vanilla js is industry standard)

This project is based off a real project of our Professor, in which with him and his team developed a program and gui to help increase covid testing efficiency in the midst of the pandemic. It works by maintaining a database in which tests can be "pooled" together to be tested all at once and then if it is negative, everyone in the pool is negative. Else they will use a "binary search" type of idea and split the tests into 50/50 and keep repeating the process, allowing there to be only "logn" tests instead of "n" tests (in the sense of actually testing the specimens collected).


To view files go to covidtesting -> then either "src" or "backend"

In src, "driver" file is app.js and
Site components are in src -> components, 

Schemas are in backend -> models
server.js is "driver" file of the backend server, and contains routes (post requests)
