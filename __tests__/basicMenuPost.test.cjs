const {render} = require('cli-testing-library');
const {resolve} = require('path')



test('Open the commands palette', async () => {
    const {clear, findByText, queryByText, userEvent, stdoutArr, debug} = await render('node', [
      resolve(__dirname, '../index.js')
    ])
    const instance = await findByText('Choose a platform')
    expect(instance).toBeInTheConsole()
  })

  
test('Digital Ocean first in list ', async () => {
    const {clear, findByText, queryByText, userEvent, stdoutArr, debug} = await render('node', [
      resolve(__dirname, '../index.js')
    ])
    expect(await findByText('❯ DigitalOcean')).toBeInTheConsole()
  })

test('Select Netlify and open menu', async () => {
    const {clear, findByText, queryByText, userEvent, stdoutArr, debug} = await render('node', [
      resolve(__dirname, '../index.js')
    ])
    userEvent.keyboard('[ArrowDown]')
    expect(await findByText('❯ Netlify')).toBeInTheConsole()
    userEvent.keyboard('[Enter]')
    expect(await findByText('❯ Create Site')).toBeInTheConsole()
})