import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertController, MenuController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Camera,CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  defaultPicture: string = 'assets/default.png';
  profilePicture: string;
  imageFile: any;

  constructor(
    private alertController: AlertController,
    private auth: AuthenticationService,
    private camera: Camera,
    private menuController: MenuController,
    private webView: WebView,
    private storage: Storage,
    private router: Router
  ) {
    this.profilePicture = this.defaultPicture;
  }

  ngOnInit() { 
    this.menuController.enable(false);
  }

  async chooseImage(){
    const alert = await this.alertController.create({
      header: 'Choose image',
      buttons: [
        {
          text: "Take Photo",
          handler: ()=>{
            this.getPhoto(1);
          }
        },{
          text: "Choose from gallery",
          handler: ()=>{
            this.getPhoto(0);
          }
        },{
          text: "Cancel",
          role: "cancel"
        }
      ]
    });
    await alert.present();
  }

  getPhoto(option: number) {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: option
    }

    this.camera.getPicture(options).then((imageData) => {
      // let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.profilePicture = this.webView.convertFileSrc(imageData);
     //Save image 
     this.imageFile = imageData;
     console.log(imageData);
    }, (err) => {
      this.showError(err);
    });
  }

  async signUp(f:NgForm){
    let errorMessage = this.isFormValid(f);
    if(errorMessage === ""){
      try {
        //For submission
        let formData = new FormData();

        Object.keys(f.value).forEach(e =>{
          formData.append(e,f.value[e]);
        });

        if(!!this.imageFile){
          formData.append('profile_picture',this.imageFile);
        }

        let token = await this.auth.signUp(formData).toPromise();
        this.storage.set('token',token);
        // this.router.navigateByUrl('/home');
        // this.socketService.socket.emit('setId',this._auth.getDecodeToken().user.user_id);
       
      } catch (error) {
        this.showError(error);
      }
    } else {
      this.showError(errorMessage);
    }
  }

  isFormValid(f:NgForm): string{
    let errorMessage = "";
    if(f.form.invalid){
      //Validate Email
      if(f.form.controls.email.errors != null){
        if(f.form.controls.email.errors.required){
          errorMessage += "Email is required\n";
        }
        if(f.form.controls.email.errors.email) {
          errorMessage += "Email format is incorrect\n";
        }
      }
      //Validate Firstname
      if(f.form.controls.firstname.errors != null){
        if(f.form.controls.firstname.errors.required){
          errorMessage += "First Name is required\n";
        }
      }
      //Validate Lastname
      if(f.form.controls.lastname.errors != null){
        if(f.form.controls.lastname.errors.required){
          errorMessage += "Last Name is required\n";
        }
      }
      //Validate Password
      if(f.form.controls.password.errors != null){
        if(f.form.controls.password.errors.required){
          errorMessage += "Password is required\n";
        }
      }
    }
    return errorMessage;
  }

  async showError(message: string){
    const alert = await this.alertController.create({
      header: 'Error',
      message: '<p style="white-space:pre;">'+message+'</p>',
      buttons: ['OK']
    });

    await alert.present();
  }

}
