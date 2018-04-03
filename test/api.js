const chai = require('chai')
const app = require('../server')
const expect = chai.expect
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

// (OK) GET get status

describe('API', () => {

    it('Running', (done) => {

        chai.request(app)
        .get('/')
        .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.a('object')
            expect(res.body.running).to.be.equal(true)
            done()
        })

    })

})