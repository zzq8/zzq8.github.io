"use strict";(self.webpackChunklearn_data=self.webpackChunklearn_data||[]).push([[7244],{824:(t,s,e)=>{e.d(s,{R:()=>a});var i=e(9549);class a{constructor(t){this.La=t}Xa(){(0,i.h)(this.ya)&&this.fg()}$(){(0,i.j)(this.ya)&&window.cancelAnimationFrame(this.ya),this.ya=void 0}fg(){this.ya=window.requestAnimationFrame((()=>{(0,i.h)(this.ya)||(this.La(),this.fg())}))}}},4863:(t,s,e)=>{e.r(s),e.d(s,{GoogleCastProvider:()=>l});var i=e(9549),a=e(3297),h=e(824),r=e(9006),n=e(7703);class c{constructor(t){this.$a=new chrome.cast.media.MediaInfo(t.src,t.type)}build(){return this.$a}lj(t){return t.includes("live")?this.$a.streamType=chrome.cast.media.StreamType.LIVE:this.$a.streamType=chrome.cast.media.StreamType.BUFFERED,this}mj(t){return this.$a.tracks=t.map(this.nj),this}oj(t,s){return this.$a.metadata=new chrome.cast.media.GenericMediaMetadata,this.$a.metadata.title=t,this.$a.metadata.images=[{url:s}],this}nj(t,s){const e=new chrome.cast.media.Track(s,chrome.cast.media.TrackType.TEXT);return e.name=t.label,e.trackContentId=t.src,e.trackContentType="text/vtt",e.language=t.language,e.subtype=t.kind.toUpperCase(),e}}const o=chrome.cast.media.TrackType.TEXT,d=chrome.cast.media.TrackType.AUDIO;class u{constructor(t,s,e){this.od=t,this.b=s,this.Ae=e}he(){const t=this.ug.bind(this);(0,i.l)(this.b.audioTracks,"change",t),(0,i.l)(this.b.textTracks,"mode-change",t),(0,i.g)(this.pj.bind(this))}nd(){return this.b.$state.textTracks().filter((t=>t.src&&"vtt"===t.type))}vg(){return this.b.$state.audioTracks()}xc(t){const s=this.od.mediaInfo?.tracks??[];return t?s.filter((s=>s.type===t)):s}qj(){const t=[],s=this.vg().find((t=>t.selected)),e=this.nd().filter((t=>"showing"===t.mode));if(s){const e=this.xc(d),i=this.ze(e,s);i&&t.push(i.trackId)}if(e?.length){const s=this.xc(o);if(s.length)for(const i of e){const e=this.ze(s,i);e&&t.push(e.trackId)}}return t}pj(){const t=this.nd();if(!this.od.isMediaLoaded)return;const s=this.xc(o);for(const e of t)if(!this.ze(s,e)){(0,i.T)((()=>this.Ae?.()));break}}rj(t){if(!this.od.isMediaLoaded)return;const s=this.vg(),e=this.nd(),i=this.xc(d),a=this.xc(o);for(const e of i){if(this.wg(s,e))continue;const i={id:e.trackId.toString(),label:e.name,language:e.language,kind:e.subtype??"main",selected:!1};this.b.audioTracks[r.L.da](i,t)}for(const s of a){if(this.wg(e,s))continue;const i={id:s.trackId.toString(),src:s.trackContentId,label:s.name,language:s.language,kind:s.subtype.toLowerCase()};this.b.textTracks.add(i,t)}}ug(t){if(!this.od.isMediaLoaded)return;const s=this.qj(),e=new chrome.cast.media.EditTracksInfoRequest(s);this.sj(e).catch((t=>{}))}sj(t){const s=(0,n.f)();return new Promise(((e,i)=>s?.editTracksInfo(t,e,i)))}wg(t,s){return t.find((t=>this.xg(t,s)))}ze(t,s){return t.find((t=>this.xg(s,t)))}xg(t,s){return s.name===t.label&&s.language===t.language&&s.subtype.toLowerCase()===t.kind.toLowerCase()}}class l{constructor(t,s){this.f=t,this.b=s,this.$$PROVIDER_TYPE="GOOGLE_CAST",this.scope=(0,i.r)(),this.K=null,this.za="disconnected",this.ua=0,this.ga=0,this.ba=new a.T(0,0),this.Aa=new a.T(0,0),this.fa=new h.R(this.kc.bind(this)),this.Pa=null,this.Be=!1,this.va=new u(this.f,this.b,this.Ae.bind(this))}get c(){return this.b.delegate.c}get type(){return"google-cast"}get currentSrc(){return this.K}get player(){return this.f}get cast(){return(0,n.g)()}get session(){return(0,n.a)()}get media(){return(0,n.f)()}get hasActiveSession(){return(0,n.j)(this.K)}setup(){this.tj(),this.uj(),this.va.he(),this.c("provider-setup",this)}tj(){(0,n.l)(cast.framework.CastContextEventType.CAST_STATE_CHANGED,this.zg.bind(this))}uj(){const t=cast.framework.RemotePlayerEventType,s={[t.IS_CONNECTED_CHANGED]:this.zg,[t.IS_MEDIA_LOADED_CHANGED]:this.Ag,[t.CAN_CONTROL_VOLUME_CHANGED]:this.Bg,[t.CAN_SEEK_CHANGED]:this.Cg,[t.DURATION_CHANGED]:this.de,[t.IS_MUTED_CHANGED]:this.Na,[t.VOLUME_LEVEL_CHANGED]:this.Na,[t.IS_PAUSED_CHANGED]:this.vj,[t.LIVE_SEEKABLE_RANGE_CHANGED]:this.nb,[t.PLAYER_STATE_CHANGED]:this.wj};this.yg=s;const e=this.xj.bind(this);for(const t of(0,i.U)(s))this.f.controller.addEventListener(t,e);(0,i.q)((()=>{for(const t of(0,i.U)(s))this.f.controller.removeEventListener(t,e)}))}async play(){(this.f.isPaused||this.Be)&&(this.Be?await this.Dg(!1,0):this.f.controller?.playOrPause())}async pause(){this.f.isPaused||this.f.controller?.playOrPause()}getMediaStatus(t){return new Promise(((s,e)=>{this.media?.getStatus(t,s,e)}))}setMuted(t){(t&&!this.f.isMuted||!t&&this.f.isMuted)&&this.f.controller?.muteOrUnmute()}setCurrentTime(t){this.f.currentTime=t,this.c("seeking",t),this.f.controller?.seek()}setVolume(t){this.f.volumeLevel=t,this.f.controller?.setVolumeLevel()}async loadSource(t){if(this.Pa?.src!==t&&(this.Pa=null),(0,n.j)(t))return this.yj(),void(this.K=t);this.c("load-start");const s=this.zj(t),e=await this.session.loadMedia(s);if(e)return this.K=null,void this.c("error",Error((0,n.c)(e)));this.K=t}destroy(){this.z(),this.Eg()}z(){this.Pa||(this.ga=0,this.ba=new a.T(0,0),this.Aa=new a.T(0,0)),this.fa.$(),this.ua=0,this.Pa=null}yj(){const t=new i.D("resume-session",{detail:this.session});this.Ag(t);const{muted:s,volume:e,savedState:a}=this.b.$state,h=a();this.setCurrentTime(Math.max(this.f.currentTime,h?.currentTime??0)),this.setMuted(s()),this.setVolume(e()),!1===h?.paused&&this.play()}Eg(){this.cast.endCurrentSession(!0);const{remotePlaybackLoader:t}=this.b.$state;t.set(null)}Aj(){const{savedState:t}=this.b.$state;t.set({paused:this.f.isPaused,currentTime:this.f.currentTime}),this.Eg()}kc(){this.Bj()}xj(t){this.yg[t.type].call(this,t)}zg(t){const s=this.cast.getCastState(),e=s===cast.framework.CastState.CONNECTED?"connected":s===cast.framework.CastState.CONNECTING?"connecting":"disconnected";if(this.za===e)return;const i={type:"google-cast",state:e},a=this.ab(t);this.za=e,this.c("remote-playback-change",i,a),"disconnected"===e&&this.Aj()}Ag(t){if(!this.f.isMediaLoaded)return;const s=(0,i.p)(this.b.$state.source);Promise.resolve().then((()=>{if(s!==(0,i.p)(this.b.$state.source)||!this.f.isMediaLoaded)return;this.z();const e=this.f.duration;this.Aa=new a.T(0,e);const h={provider:this,duration:e,buffered:this.ba,seekable:this.Fg()},r=this.ab(t);this.c("loaded-metadata",void 0,r),this.c("loaded-data",void 0,r),this.c("can-play",h,r),this.Bg(),this.Cg(t);const{volume:n,muted:c}=this.b.$state;this.setVolume(n()),this.setMuted(c()),this.fa.Xa(),this.va.rj(r),this.va.ug(r)}))}Bg(){this.b.$state.canSetVolume.set(this.f.canControlVolume)}Cg(t){const s=this.ab(t);this.c("stream-type-change",this.Cj(),s)}Cj(){const t=this.f.mediaInfo?.streamType;return t===chrome.cast.media.StreamType.LIVE?this.f.canSeek?"live:dvr":"live":"on-demand"}Bj(){if(this.Pa)return;const t=this.f.currentTime;if(t===this.ua)return;const s=this.ga,e={currentTime:t,played:this.uc(t)};this.c("time-update",e),t>s&&this.nb(),this.b.$state.seeking()&&this.c("seeked",t),this.ua=t}uc(t){return this.ga>=t?this.ba:this.ba=new a.T(0,this.ga=t)}de(t){if(!this.f.isMediaLoaded||this.Pa)return;const s=this.f.duration,e=this.ab(t);this.Aa=new a.T(0,s),this.c("duration-change",s,e)}Na(t){if(!this.f.isMediaLoaded)return;const s={muted:this.f.isMuted,volume:this.f.volumeLevel},e=this.ab(t);this.c("volume-change",s,e)}vj(t){const s=this.ab(t);this.f.isPaused?this.c("pause",void 0,s):this.c("play",void 0,s)}nb(t){const s={seekable:this.Fg(),buffered:this.ba},e=t?this.ab(t):void 0;this.c("progress",s,e)}wj(t){const s=this.f.playerState,e=chrome.cast.media.PlayerState;if(this.Be=s===e.IDLE,s===e.PAUSED)return;const i=this.ab(t);switch(s){case e.PLAYING:this.c("playing",void 0,i);break;case e.BUFFERING:this.c("waiting",void 0,i);break;case e.IDLE:this.fa.$(),this.c("pause"),this.c("end")}}Fg(){return this.f.liveSeekableRange?new a.T(this.f.liveSeekableRange.start,this.f.liveSeekableRange.end):this.Aa}ab(t){return t instanceof Event?t:new i.D(t.type,{detail:t})}Dj(t){const{streamType:s,title:e,poster:i}=this.b.$state;return new c(t).oj(e(),i()).lj(s()).mj(this.va.nd()).build()}zj(t){const s=this.Dj(t),e=new chrome.cast.media.LoadRequest(s),i=this.b.$state.savedState();return e.autoplay=!1===(this.Pa?.paused??i?.paused),e.currentTime=this.Pa?.time??i?.currentTime??0,e}async Dg(t,s){const e=(0,i.p)(this.b.$state.source);this.Pa={src:e,paused:t,time:s},await this.loadSource(e)}Ae(){this.Dg(this.f.isPaused,this.f.currentTime).catch((t=>{}))}}}}]);