import chai from 'chai'
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised'

// function under test
import { getById } from '../../services/user.service'

// dependencies
import { User } from '../../model/user'
import * as userRepository from '../../repositories/user.repository'
import { ServiceError } from '../../types/errors'

chai.use(chaiAsPromised)
chai.should()

describe('user.service.getById', function () {
    afterEach(function () {
        sinon.restore()
    })

    it('should get the user', function () {
        const testUser: User = {
            id: 'test-user-id',
            name: 'Javier',
            email: 'javier.balam@gmail.com',
        }

        sinon.replace(userRepository, 'getById', sinon.fake.resolves(testUser))

        return getById('test-user-id').should.eventually.be.fulfilled
    })

    it('should throw an error if the user does not exist', function () {
        sinon.replace(userRepository, 'getById', sinon.fake.resolves(null))

        return getById('test-user-id')
            .should.eventually.be.rejectedWith(ServiceError)
            .and.have.property('code', 'USER_NOT_FOUND')
    })
})
