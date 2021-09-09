import chai, { expect } from "chai"
import { User } from "../../model/user"
import { signup } from '../../services/user.service'
import chaiAsPromised from 'chai-as-promised'
import * as userRepository from '../../repositories/user.repository'
import sinon from 'sinon'

chai.use(chaiAsPromised);
chai.should();

describe('user.service', function() {
    let createOrUpdateStub;

    beforeEach(function () {
        createOrUpdateStub = sinon.stub(userRepository, "createOrUpdate");
    });
  
    afterEach(function () {
        createOrUpdateStub.restore();
    });
    it('signup', function() {
        const testUser : User = {
            name: 'Javier'
        }
        createOrUpdateStub.returns(Promise.resolve({ id: 'javier'}));
        return signup(testUser).should.eventually.be.fulfilled.with.property('id', 'javier')
    })
})