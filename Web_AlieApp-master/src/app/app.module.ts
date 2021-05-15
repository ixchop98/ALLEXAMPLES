import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeAdminComponent } from './home-admin/home-admin.component';
import { ReportComponent } from './report/report.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { EditMisionComponent } from './edit-mision/edit-mision.component';

//INTERMEDIARIOS


import { EditVisionComponent } from './edit-vision/edit-vision.component';
import { EditSobremiComponent } from './edit-sobremi/edit-sobremi.component';
import { EditImageComponent } from './edit-image/edit-image.component';
import { EditVideoComponent } from './edit-video/edit-video.component';
import { HomeCrudUserComponent } from './home-crud-user/home-crud-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { TreeViewComponent } from '@syncfusion/ej2-angular-navigations';
import { ReportTreeComponent } from './report-tree/report-tree.component';
import { ReportModifyComponent } from './report-modify/report-modify.component';
import { ReportBitacoraComponent } from './report-bitacora/report-bitacora.component';
import { ReportUserAccessComponent } from './report-user-access/report-user-access.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    HomeAdminComponent,
    ReportComponent,
    ListadoUsuariosComponent,
    EditMisionComponent,
    EditVisionComponent,
    EditSobremiComponent,
    EditImageComponent,
    EditVideoComponent,
    HomeCrudUserComponent,
    EditUserComponent,
    CreateUserComponent,
    HomeUserComponent,
    TreeViewComponent,
    ReportTreeComponent,
    ReportModifyComponent,
    ReportBitacoraComponent,
    ReportUserAccessComponent,
    EditProfileComponent
  ],
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    HttpClientModule
  ],
  providers: [
  	appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
