export interface CurrentUser {
  id:string
  firstName:string
  lastName:string
  email:string
  phone:string
  profileImage:string | null
  role: {
    type:string
    title:string
  }
  language:{
    type:string
    name:string
  }
  status:{
    type:string
    title:string
  }
}