import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ImageBanniere } from 'src/app/components/models/image-banniere';
import { ImageBanniereService } from 'src/app/components/services/image-banniere.service';

@Component({
  selector: 'app-image-banniere',
  templateUrl: './image-banniere.component.html',
  styleUrl: './image-banniere.component.scss'
})
export class ImageBanniereComponent {
  @Output() imageAdded = new EventEmitter<any>();

  displayModal: boolean = false; // Contrôle la visibilité du modal

  imageDialog: boolean = false;
  actionLabel: string = 'Enregistrer';
  deleteImageDialog: boolean = false;
  images: ImageBanniere[] = [];
  image: ImageBanniere = {
    _id: '',
  };
  selectedImages: ImageBanniere[] = [];
  ImageUrl!: string; // Déclaration de l'URL de l'image du image

  submitted: boolean = false;
  uploadedFiles: File[] = [];

  cols: any[] = [];
  statuses: any[] = [];
  rowsPerPageOptions = [5, 10, 20];

  constructor(
    private messageService: MessageService,
    private ImageService: ImageBanniereService,

  ) {}

  ngOnInit() {
    this.image = { _id: '' }; // Initialiser le image
    this.uploadedFiles = []; // Initialiser les fichiers téléchargés
    this.getAllImages();
  }

  openNew() {
    this.image = {
      _id: '',
    };
    this.submitted = false;
    this.imageDialog = true;
    this.actionLabel = 'Enregistrer';

  }

  deleteImage(image: ImageBanniere) {
    if (image && image._id) {
      this.deleteImageDialog = true;
      this.image = { ...image };
    } else {
      console.error('image object is missing ID:', image);
    }
  }

  // confirmDelete() {
  //   if (this.image && this.image._id) {
  //     // Supprimer l'image de la base de données
  //     this.ImageService.deleteImage(this.image._id).subscribe(
  //       response => {
  //         // Filtrer les images pour supprimer celle qui a été supprimée
  //         this.images = this.images.filter(val => val._id !== this.image._id);
          
  //         // Vérifier si this.image.image n'est pas undefined avant de le passer
  //         if (this.image.image) {
  //           this.removeImageFromLocalStorage(this.image.image); // Appel à la méthode pour supprimer de localStorage
  //         } else {
  //           console.error('Image is undefined:', this.image);
  //         }
  
  //         this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Image Deleted', life: 3000 });
  //         this.image = { _id: '' };
  //         this.deleteImageDialog = false;
  //       },
  //       error => {
  //         console.error('Error deleting image:', error);
  //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete image', life: 3000 });
  //         this.deleteImageDialog = false;
  //       }
  //     );
  //   } else {
  //     console.error('Invalid image ID:', this.image);
  //     this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid image ID', life: 3000 });
  //     this.deleteImageDialog = false;
  //   }
  // }

  // private removeImageFromLocalStorage(image: string): void {
  //   // Récupérer les images stockées depuis localStorage
  //   const storedImages = JSON.parse(localStorage.getItem('bannerImages') || '[]');
  
  //   // Filtrer les images pour supprimer celle qui a été supprimée
  //   const updatedImages = storedImages.filter((img: string) => img !== image);
    
  //   // Mettre à jour localStorage avec la liste modifiée
  //   localStorage.setItem('bannerImages', JSON.stringify(updatedImages));
  // }

  confirmDelete() {
    if (this.image && this.image._id) {
        // Delete the image from the database
        this.ImageService.deleteImage(this.image._id).subscribe(
            response => {
                // Filter out the deleted image from the local `images` array
                this.images = this.images.filter(val => val._id !== this.image._id);
                
                // Check if `this.image.image` exists before attempting to remove from localStorage
                if (this.image.image) {
                    this.removeImageFromLocalStorage(this.image.image); // Remove from localStorage
                } else {
                    console.error('Image is undefined:', this.image);
                }
        
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Image Deleted', life: 3000 });
                this.image = { _id: '' };
                this.deleteImageDialog = false;
            },
            error => {
                console.error('Error deleting image:', error);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Delete Image', life: 3000 });
                this.deleteImageDialog = false;
            }
        );
    } else {
        console.error('Invalid image ID:', this.image);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid image ID', life: 3000 });
        this.deleteImageDialog = false;
    }
}

private removeImageFromLocalStorage(imageUrl: string): void {
  // Retrieve stored images from localStorage
  const storedImages = JSON.parse(localStorage.getItem('bannerImages') || '[]');

  console.log('Stored images before deletion:', storedImages);
  console.log('Image URL to delete:', imageUrl);

  // Filter images to remove the entire object where the image URL matches
  const updatedImages = storedImages.filter((img: any) => img.image !== imageUrl);

  console.log('Stored images after deletion:', updatedImages);

  // If no images are left, remove the entire 'bannerImages' key from localStorage
  if (updatedImages.length === 0) {
      localStorage.removeItem('bannerImages');
      console.log('bannerImages key removed from localStorage');
  } else {
      // Otherwise, update localStorage with the modified list
      localStorage.setItem('bannerImages', JSON.stringify(updatedImages));
  }
}




  hideDialog() {
    this.imageDialog = false;
    this.submitted = false;
  }

  
  getAllImages(): void {
    this.ImageService.getImage().subscribe(
      images => {
        this.images = images;
        console.log("images récupérés:", this.images);
      },
      error => {
        console.error('Erreur lors de la récupération des images:', error);
      }
    );
  }

  saveImage(): void {
    if (this.uploadedFiles.length === 0) {
        console.error('Veuillez remplir tous les champs obligatoires.');
        return;
    }

    const formData = new FormData();
    formData.append('image', this.uploadedFiles[0]);
    formData.append('titre', this.image.titre ?? ''); 
    formData.append('sousTitre', this.image.sousTitre ?? '');
    

    console.log('Données envoyées au backend :', formData);


        this.ImageService.addImage(formData).subscribe(
            res => {
                console.log('Réponse du backend pour l\'ajout du image :', res);
                this.imageDialog = false;
                this.image = { _id: '' };
                this.uploadedFiles = [];
                this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'image ajouté', life: 3000 });
                this.getAllImages();

            },
            (error: HttpErrorResponse) => {
                console.error('Erreur lors de l\'ajout du image:', error);
                this.messageService.add({ severity: 'error', summary: 'Erreur lors de l\'ajout du image', detail: error.message });
            }
        );
    
}


onFileSelected(event: any): void {
  if (event.files && event.files.length > 0) {
    this.uploadedFiles = [];
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
  } else {
    console.error("Erreur lors de la sélection du fichier : la propriété 'files' n'est pas définie dans l'événement.");
  }
}

getImageUrl(imageName: string): string {
  return `${imageName}`;
}

// ImageBanniereComponent.ts
addToBanner(image: any): void {
  // Retrieve existing banner images from localStorage, defaulting to an empty array if not found
  const storedImages = JSON.parse(localStorage.getItem('bannerImages') || '[]');

  // Check if the image with the same `_id` is already stored
  const isImageStored = storedImages.some((storedImage: any) => storedImage._id === image._id);

  if (!isImageStored) {
      // Push the entire image object including `titre`, `sousTitre`, and `image`
      storedImages.push({
          _id: image._id,
          image: image.image,
          titre: image.titre,
          sousTitre: image.sousTitre
      });

      // Save the updated array back to localStorage
      localStorage.setItem('bannerImages', JSON.stringify(storedImages));
  }

  // Emit the event to notify the parent component
  this.imageAdded.emit(image); // Ensure EventEmitter is imported and initialized
}




}
