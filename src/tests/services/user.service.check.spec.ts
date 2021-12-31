import chai from 'chai'
import sinon from 'sinon'
import chaiAsPromised from 'chai-as-promised'

// function under test
import { check } from '../../services/user.service'

// dependencies
import { User } from '../../model/user'
import * as userRepository from '../../repositories/user.repository'
import * as auth from 'firebase-admin/auth'
import { UserRecord } from 'firebase-admin/auth'

chai.use(chaiAsPromised)
chai.should()

describe('user.service.check', function () {
    afterEach(function () {
        sinon.restore()
    })

    it('should return uid if user already exists', function () {
        const testUser: User = {
            id: 'test-user-id',
            name: 'Javer',
            email: 'javier.balam@gmail.com',
        }

        sinon.replace(userRepository, 'getById', sinon.fake.resolves(testUser))

        return check(testUser.id!).should.eventually.be.fulfilled.with.string(
            testUser.id!
        )
    })

    it('should return uid if it is a new user', function () {
        const testUser: User = {
            id: 'test-user-id',
            name: 'Javer',
            email: 'javier.balam@gmail.com',
        }

        sinon.replace(userRepository, 'getById', sinon.fake.resolves(null))
        sinon.replace(
            auth,
            'getAuth',
            sinon.fake.returns({
                getUser: sinon.fake.resolves(testUser as UserRecord),
            })
        )
        sinon.replace(
            userRepository,
            'createOrUpdate',
            sinon.fake.resolves(testUser as UserRecord)
        )

        return check(testUser.id!).should.eventually.be.fulfilled.with.string(
            testUser.id!
        )
    })
})
