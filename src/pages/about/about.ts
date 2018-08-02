import {Component, OnInit, NgModule} from '@angular/core';
import { NavController } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage implements OnInit {
  constructor(private qrScanner: QRScanner) { }

  private light: number = 0;
  private camera: number = 0;
  public status = {} ;


  ngOnInit() {
    this.prepare();
  }

  toggleLight() {
    if (this.light === 0) {
      this.light = 1;
      this.enablelight();
    }
    else {
      this.light = 0;
      this.disablelight();
    }
  }

  toogleCamera() {
    if (this.camera == 0) {
      this.camera = 1;
    }
    else {
      this.camera = 0;
    }
    this.useCameara(this.camera);
  }

  showstatus() {
    this.logtoconsole(this.qrScanner.getStatus());
  }



  getstatus(x) {
    document.getElementById('log').innerHTML = JSON.stringify(x);
    console.log(x);
  }


  prepare() {
    this.logtoconsole(this.qrScanner.prepare());
  }

  startscann() {
    this.useCameara(this.camera);
    this.logtoconsole(this.qrScanner.scan());

  }

  stopscann() {
    //this.qrScanner.cancelScan(this.logtoconsole);
  }

  showscreen() {
    this.logtoconsole(this.qrScanner.show());
  }

  hidescreen() {
    this.logtoconsole(this.qrScanner.hide());
  }

  enablelight() {
    this.logtoconsole(this.qrScanner.enableLight());
  }

  disablelight() {
    this.logtoconsole(this.qrScanner.disableLight());
  }

  useFrontcamera() {
    this.qrScanner.useFrontCamera();
  }

  useBackcamera() {
    this.logtoconsole(this.qrScanner.useBackCamera());
  }

  useCameara(x) {
    if (x > 1 && x < 0) {
      x = 0;
    }
    this.logtoconsole(this.qrScanner.useCamera(x));
  }

  displayContents(err, text) {
    if (err) {
      alert('error-display content');
      console.error(err);
      // an error occurred, or the scan was canceled (error code `6`)
    } else {
      // The scan completed, display the contents of the QR code:
      alert('gefunden');
      alert(text);
    }
  }

  onDone(err, status) {
    if (err) {
      // here we can handle errors and clean up any loose ends.
      console.error(err);
    }
    if (status.authorized) {
      // W00t, you have camera access and the scanner is initialized.
      // QRscanner.show() should feel very fast.
    } else if (status.denied) {
      // The video preview will remain black, and scanning is disabled. We can
      // try to ask the user to change their mind, but we'll have to send them
      // to their device settings with `QRScanner.openSettings()`.
      this.qrScanner.openSettings();
    } else {
      // we didn't get permission, but we didn't get permanently denied. (On
      // Android, a denial isn't permanent unless the user checks the "Don't
      // ask again" box.) We can ask again at the next relevant opportunity.
    }
  }

  logtoconsole (status) {
    console.log(status);
  }

  loganderror(err, status) {
    if (err) {
      if (err.name === 'SCAN_CANCELED') {
        console.error('The scan was canceled before a QR code was found.');
      } else {
        console.error(err._message);
      }
    }
    console.log(status);
  }


  scan() {
  // Optionally request the permission early
    this.qrScanner.prepare()
      .then((status: QRScannerStatus) => {
        if (status.authorized) {
          // camera permission was granted


          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            console.log('Scanned something', text);

            this.qrScanner.hide(); // hide camera preview
            scanSub.unsubscribe(); // stop scanning
          });

        } else if (status.denied) {
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
        }
      })
      .catch((e: any) => console.log('Error is', e));
  }
}
