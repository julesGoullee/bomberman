'use strict';

const ConnectorsMock = require('testConfig/connectorsMock.es6');
const AuthFbMock = require('testConfig/facebookMock.es6');
const CookieMock = require('testConfig/cookieMock.es6');

const Auth = require('inject!auth/auth.es6')({
  'auth/facebook.es6': AuthFbMock,
  'js-cookie/src/js.cookie': CookieMock,
  'connectors/connectors.es6': ConnectorsMock
});

describe('Auth', () => {
  var _auth;
  var _spyCbLoadScript;
  
  beforeEach( () => {
    _spyCbLoadScript = jasmine.createSpy('spy');
    new ConnectorsMock();
    new CookieMock();
    _auth = new Auth(_spyCbLoadScript);
  });
  
  it('Peut instancier auth et appeler le callback après load fbScript', () => {
    AuthFbMock.__test_cbLoadScript();
    expect(_spyCbLoadScript).toHaveBeenCalled();
  });
  
  describe('Avec cookie valide', () => {
    var cbReady;
    beforeEach( () => {
      CookieMock.set('tokenValide');
      cbReady = jasmine.createSpy('spy');
    });
    
    it('Call signIn connector', () => {
      spyOn(ConnectorsMock, 'signIn');
      _auth.ready(cbReady);
      AuthFbMock.__test_cbLoadScript('accessTokenValide');
      
      expect(ConnectorsMock.signIn).toHaveBeenCalled();
    });

    it('SignIn call connector valide user', () => {
      _auth.ready(cbReady);
      AuthFbMock.__test_cbLoadScript({accessToken: 'accessTokenValide'});

      expect(ConnectorsMock._test_isValide() ).toBeTruthy();
    });
    
    it('Call launch connector for webSocket', () => {
      _auth.ready(cbReady);
      AuthFbMock.__test_cbLoadScript({accessToken: 'accessTokenValide'});
      
      expect(cbReady ).toHaveBeenCalledWith({ id: '1', name: 'test1' });
    });
    
    afterEach( () => {
      CookieMock.remove();
    });
    
  });
  
  describe('Sans cookie', () => {
    var cbReady;
    beforeEach( () => {
      CookieMock.remove();
      cbReady = jasmine.createSpy('spy');
    });
  
    it('Call signUp connector', () => {
      spyOn(ConnectorsMock, 'signUp');
      _auth.ready(cbReady);
      AuthFbMock.__test_cbLoadScript('accessTokenValide');
      expect(ConnectorsMock.signUp ).toHaveBeenCalled();
    });

    it('Call launch connector for webSocket', () => {
      _auth.ready(cbReady);
      AuthFbMock.__test_cbLoadScript({accessToken: 'accessTokenValide'});

      expect(cbReady).toHaveBeenCalledWith({ id: '1', name: 'test1' });
    });
  });
});
