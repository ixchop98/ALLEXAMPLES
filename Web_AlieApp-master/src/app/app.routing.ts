import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReportComponent } from './report/report.component';
import { ListadoUsuariosComponent } from './listado-usuarios/listado-usuarios.component';
import { EditMisionComponent } from './edit-mision/edit-mision.component';
import { EditVisionComponent } from './edit-vision/edit-vision.component';
import { EditSobremiComponent } from './edit-sobremi/edit-sobremi.component';
import { EditImageComponent } from './edit-image/edit-image.component';
import { EditVideoComponent } from './edit-video/edit-video.component';
import { HomeCrudUserComponent } from './home-crud-user/home-crud-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { HomeUserComponent } from './home-user/home-user.component';
import { ReportTreeComponent } from './report-tree/report-tree.component';
import { ReportModifyComponent } from './report-modify/report-modify.component';
import { ReportBitacoraComponent } from './report-bitacora/report-bitacora.component';
import { ReportUserAccessComponent } from './report-user-access/report-user-access.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';  

const appRoutes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'home', component:HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'changePassword/:id', component: ChangePasswordComponent },
	{ path: 'Report', component: ReportComponent },
	{ path: 'listadoUsuarios', component: ListadoUsuariosComponent },
	{ path: 'editMision', component: EditMisionComponent },
	{ path: 'editVision', component: EditVisionComponent },
	{ path: 'editSobreMi', component: EditSobremiComponent },
	{ path: 'editImage', component: EditImageComponent },
	{ path: 'editVideo', component: EditVideoComponent },
	{ path: 'homeCrud', component: HomeCrudUserComponent },
	{ path: 'editUser/:id', component: EditUserComponent },
	{ path: 'createUser', component: CreateUserComponent },
	{ path: 'homeUser', component: HomeUserComponent },
	{ path: 'reportTree', component: ReportTreeComponent },
	{ path: 'reportModify', component: ReportModifyComponent },
	{ path: 'reportBitacora', component: ReportBitacoraComponent },
	{ path: 'reportUserAc', component: ReportUserAccessComponent },
	{ path: 'editProfile', component: EditProfileComponent },
	{ path: '**', component:RegisterComponent } //404
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);