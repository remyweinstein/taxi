define(['sipjs', 'Dom'], function(sipjs, Dom) {
  var button = Dom.sel('[data-click="callSip"]'),
      aliceUA;
      
  function createUA(callerURI, displayName, alicePass) {    
    var configuration = {
          traceSip: true,
          uri: callerURI,
          password: alicePass,
          displayName: displayName
        },
        userAgent = new sipjs.UA(configuration);

    return userAgent;
  }


  
  var Sip = {
      register: function (aliceName, aliceURI, alicePass) {
            if (sipjs.WebRTC.isSupported()) {
              aliceUA = createUA(aliceURI, aliceName, alicePass);

              var numToRegister = 4,
                  numRegistered = 0,
                  registrationFailed = false,
                  markAsRegistered = function () {
                    button.style.color = 'green';
                    numRegistered += 1;
                    if (numRegistered >= numToRegister && !registrationFailed) {
                      setupInterfaces();
                    }
                  },
                  failRegistration = function () {
                    registrationFailed = true;
                    button.style.color = 'grey';
                    failInterfaceSetup();
                  };

              aliceUA.on('registered', markAsRegistered);
              aliceUA.on('registrationFailed', failRegistration);

              window.onunload = function () {
                aliceUA.stop();
              };

              function setupInterfaces() {
                var target = aliceName==="grebenyuk" ? 'indrivercopy@intt.onsip.com' : 'grebenyuk@intt.onsip.com';
                
                setUpVideoInterface(aliceUA, target, 'remoteVideo');
              }
              
              function failInterfaceSetup() {
                console.log('Max registration limit hit. Could not register all user agents, so they cannot communicate. The app is disabled.');
              }
            }
          },
          
          stop: function () {
            //button.removeEventListener('click', eventClickListner);
          },
          
          mediaOptions: function(audio, video, remoteRender, localRender) {
            return {
              media: {
                constraints: {
                  audio: audio,
                  video: video
                },
                render: {
                  remote: remoteRender,
                  local: localRender
                }
              }
            };
          },

          makeCall: function(userAgent, target, audio, video, remoteRender, localRender) {
            var options = mediaOptions(audio, video, remoteRender, localRender),
                session = userAgent.invite('sip:' + target, options);

            return session;
          },

          setUpVideoInterface: function(userAgent, target, remoteRenderId) {
            var onCall = false,
                session,
                remoteRender = document.getElementById(remoteRenderId);

            userAgent.on('invite', function (incomingSession) {
              var options = mediaOptions(true, false, remoteRender, null);
              
              onCall = true;
              button.style.color = 'red';
              session = incomingSession;
              session.accept(options);
              
              session.on('bye', function () {
                onCall = false;
                button.style.color = 'green';
                session = null;
              });
            });

            button.addEventListener('click', eventClickListner);
            
            function eventClickListner() {
              if (onCall) {
                onCall = false;
                button.style.color = 'green';
                session.bye();
                session = null;
              } else {
                onCall = true;
                button.style.color = 'red';

                session = makeCall(userAgent, target,
                                   true, false,
                                   remoteRender, null);
                session.on('bye', function () {
                  onCall = false;
                  session = null;
                });
              }
            }
            
          }
          
          
      
    };
  
  return Sip;
  
});
  /*
   * 
Address of Record:	grebenyuk@intt.onsip.com
SIP Password:	4GREG49SdE76ztDk
Auth Username:	intt
Username:	grebenyuk
Domain:	intt.onsip.com
Outbound Proxy:	sip.onsip.com
  
Address of Record:	d.grebenyuk30@intt.onsip.com
SIP Password:	cPHzhQtpeKBu4qX3
Auth Username:	intt_d_grebenyuk30
Username:	d.grebenyuk30
Domain:	intt.onsip.com
Outbound Proxy:	sip.onsip.com  
  
Address of Record:	indrivercopy@intt.onsip.com
SIP Password:	vywnpDXMc6nhzpUH
Auth Username:	intt_indrivercopy
Username:	indrivercopy
Domain:	intt.onsip.com
Outbound Proxy:	sip.onsip.com

Address of Record:	e.sergeenko30@intt.onsip.com
SIP Password:	agnQMe3YCo4uA3Kw
Auth Username:	intt_e_sergeenko30
Username:	e.sergeenko30
Domain:	intt.onsip.com
Outbound Proxy:	sip.onsip.com
  
   * 
   * 
   * 
   * 
   * 
   * 
   */