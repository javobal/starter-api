import chai from 'chai'
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised'

// function under test
import { deleteById } from '../../services/user.service'

// dependencies
import { User } from '../../model/user'
import * as userRepository from '../../repositories/user.repository'
import { WriteResult} from 'firebase-admin/firestore'

chai.use(chaiAsPromised)
chai.should()

describe('user.service.deleteById', function () { 
    afterEach(function () {
        sinon.restore()
    })

    it('should delete the user', function () {

        const testUser: User = {
            id: 'test-user-id',
            name: 'Javer',
            email: 'javier.balam@gmail.com',
        }

        sinon.replace(userRepository, 'getById', sinon.fake.resolves(testUser))
        sinon.replace(userRepository, 'deleteById', sinon.fake.resolves({ writeTime: '333'} as unknown as WriteResult))

        return deleteById('test-user-id').should.eventually.be.fulfilled
    })
})