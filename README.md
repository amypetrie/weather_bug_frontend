# Self-Directed Front-End Start Kit

## Initial Setup

1. Clone this starter kit repository and rename the repository to anything you'd like in one command:

  ```shell
  git clone git@github.com:turingschool-projects/self-directed-fe-starter.git <name of your choice>
  ```
2. Change into the new director directory.

3. Remove the default remote (origin):

  ```shell
  git remote rm origin
  ```

4. Create a new repository on GitHub.

5. Add your new repository remote - **your remote URL and user name will be different in the command below**

  ```shell
  git remote add origin git@github.com:<YOUR GITHUB NAME>/<PROJECT NAME>.git
  ```

6. Install the dependencies of the starter kit:

  ```shell
  npm install
  ```

7. Add, commit, and push up to your repository:

  ```shell
  git add .
  git commit -m "Initial commit using starter kit"
  git push origin master
  ```

## Running the Server Locally

To see your code in action locally, you need to fire up a development server. Use the command:

```shell
npm start
```

Once the server is running, visit in your browser:

* `http://localhost:8080/` to run your application.


## GitHub Pages Setup

This site will be served from GitHub Pages in production.

In order to see your application running on production:

1. From the command line, run `npm run build`.

2. Commit and push your application to GitHub.

3. Visit your repository on Github

4. Go to Settings

5. Under the Github Pages section of Options, select 'master' as your source and click `Save`

Be sure to `npm run build` and commit before each push to master. A few seconds after you push up, you should be able to see your application at <https://your-github-username.github.io/project-name>.


## Built With

* [JavaScript](https://www.javascript.com/)
* [jQuery](https://jquery.com/)
* [Express](https://expressjs.com/)
* [Mocha](https://mochajs.org/)
* [Chai](https://chaijs.com/)

