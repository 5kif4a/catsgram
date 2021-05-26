<template>
  <div class="create_post">
    <div class="form">
      <label
        class="form__label"
        for="content"
      >
        Post content
      </label>

      <textarea
        id="content"
        v-model="body"
        class="form__textarea"
        maxlength="200"
        rows="5"
      >
      </textarea>

      <div class="form__file">
        <div class="form__file__controls">
          <label class="form__file__controls__label" for="img">
            <input
              id="img"
              ref="pic"
              accept="image/*"
              style="display: none"
              type="file"
              @change="handleChangePicture"
              :disabled="isPublishing"
            >
            <v-icon>
              mdi-image
            </v-icon>

            Upload cat picture
          </label>

          <v-btn
            v-if="picture"
            elevation="2"
            icon
            size="32"
            style="margin: 0 16px"
            @click="handleClearPicture"
            :disabled="isPublishing"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>

          <div v-if="isPublishing">
            Uploaded {{ uploadProgress.toFixed(2) }}%
          </div>
        </div>

        <p v-if="picture" class="form__file__name">{{ picture.name }}</p>

        <v-btn
          class="form__publish_btn"
          @click="publishPost"
          :disabled="isPublishing"
        >
          Publish post
        </v-btn>

        <div v-if="pictureURL" class="preview">
          <p class="preview__title">
            Picture preview
          </p>
          <img v-if="pictureURL" :src="pictureURL" class="preview__img">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import toastr from 'toastr'
import {db, storage} from "../firebase";
import {mapState} from "vuex";

export default {
  name: "CreatePost",
  data() {
    return {
      body: "",
      picture: null,
      pictureURL: "",
      isValid: false,
      downloadURL: '',
      uploadProgress: 0,
      isPublishing: false
    }
  },
  methods: {
    validateForm() {
      this.isValid = !!(this.body.length && this.picture);
    },

    publishPost() {
      this.validateForm()

      if (!this.isValid) {
        toastr.options = {
          positionClass: 'toast-bottom-left'
        }
        toastr.error('Fill out the form and attach a picture of the cat')
        return;
      }

      const user = this.user

      this.isPublishing = true

      const storageRef = storage.ref(`images/${this.picture.name}`)
      const postsRef = db.ref('/posts')

      const uploadTask = storageRef.put(this.picture)

      uploadTask.on('state_changed',
        snapshot => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        error => {
          toastr.error(error)
          this.isPublishing = false
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            postsRef.push({
              user_id: user.uid,
              username: user.displayName,
              user_avatar: user.photoURL,
              body: this.body,
              image_url: downloadURL,
              createdAt: new Date().toISOString(),
              likes: 0
            })
          });

          this.isPublishing = false

          toastr.success('Post published')

          this.$router.push('/')
        })
    },

    handleChangePicture(event) {
      const file = event.target.files[0]

      this.picture = file
      this.pictureURL = URL.createObjectURL(file)
    },

    handleClearPicture() {
      this.$refs.pic.value = null
      URL.revokeObjectURL(this.pictureURL)

      this.picture = null
      this.pictureURL = null
    }
  },
  computed: mapState({
    user: state => state.user
  }),
}
</script>

<style scoped>
.create_post {
  margin: 32px auto;
  max-width: 900px;
}

.form {
  display: block;
}

.form__label {
  display: block;
  margin-bottom: 8px;
}

.form__textarea {
  width: 100%;
  padding: 8px;
  resize: none;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  outline: 0;
}

.form__file {
  display: block;
}

.form__file__controls {
  display: flex;
  align-items: center;
}

.form__file__controls__label {
  width: fit-content;
  display: block;
  margin-top: 8px;
  padding: 8px;
  cursor: pointer;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
}

.form__file__name {
  margin-top: 8px;
}

.form__publish_btn {
  margin-top: 16px;
}

.preview {
  width: 100%;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.preview__title {
  margin-bottom: 16px;
}

.preview__img {
  width: 600px;
}
</style>